import pandas as pd
from flask import Flask, jsonify
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error
import numpy as np
from datetime import datetime, timedelta

app = Flask(__name__)

def load_data():
    df = pd.read_csv('visa_stocks.csv')
    df['Date'] = pd.to_datetime(df['Date'])
    return df

def train_model(df):
    df['Days'] = (df['Date'] - df['Date'].min()).dt.days
    
    df['Log_Close'] = np.log(df['Close'])
    
    X = df[['Days']]
    y = df['Log_Close']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train_scaled, y_train)

    y_pred = model.predict(X_test_scaled)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    print(f'RMSE: {rmse}')

    return model, scaler

def predict_future_dates(model, scaler, start_date, num_days):
    predictions = []
    future_dates = [start_date + timedelta(days=i) for i in range(num_days)]

    for date in future_dates:
        days_since_start = (date - future_dates[0]).days
        days_scaled = scaler.transform([[days_since_start]])
        predicted_log_close = model.predict(days_scaled)

        predicted_close = np.exp(predicted_log_close[0])

        predictions.append({
            "Date": date.isoformat(),
            "Close": float(predicted_close)
        })

    return predictions

df = load_data()
model, scaler = train_model(df)

@app.route('/predict', methods=['GET'])
def predict():
    start_date = datetime(2024, 10, 21)
    predictions = predict_future_dates(model, scaler, start_date, 730)

    return jsonify(predictions)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
