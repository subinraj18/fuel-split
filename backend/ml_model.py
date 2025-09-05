import pandas as pd
from sklearn.linear_model import LinearRegression
from models import Trip


def train_and_predict(kms_to_predict):
    """
    Trains a linear regression model on past trip data and predicts
    the cost for a new trip distance.
    """
    # 1. Fetch all past trips from the database
    trips = Trip.query.all()

    # 2. Check if we have enough data to train a model (need at least 2 points for a line)
    if len(trips) < 2:
        return None  # Not enough data to make a meaningful prediction

    # 3. Prepare the data for scikit-learn
    # We use a DataFrame for easy handling
    df = pd.DataFrame([(trip.total_kms, trip.total_cost)
                      for trip in trips], columns=['kms', 'cost'])

    # X = features (kilometers), y = target (cost)
    X = df[['kms']]
    y = df['cost']

    # 4. Create and train the Linear Regression model
    model = LinearRegression()
    model.fit(X, y)

    # 5. Predict the cost for the new distance
    # The input must be a 2D array, so we use [[kms_to_predict]]
    predicted_cost = model.predict([[kms_to_predict]])

    # The prediction is an array, so we return the first item
    return predicted_cost[0]
