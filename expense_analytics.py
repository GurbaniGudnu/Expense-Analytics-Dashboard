import csv
import json

category_totals = {}
date_totals = {}
monthly_totals = {}

total_expense = 0
transaction_count = 0

with open("expenses.csv", "r") as file:

    reader = csv.DictReader(file)

    for row in reader:

        amount = float(row["Amount"])
        category = row["Category"]
        date = row["Date"]

        month = date[:7]

        total_expense += amount
        transaction_count += 1

        # Category totals

        if category in category_totals:
            category_totals[category] += amount
        else:
            category_totals[category] = amount

        # Date totals

        if date in date_totals:
            date_totals[date] += amount
        else:
            date_totals[date] = amount

        # Monthly totals

        if month in monthly_totals:
            monthly_totals[month] += amount
        else:
            monthly_totals[month] = amount

# Highest category

top_category = max(
    category_totals,
    key=category_totals.get
)

top_category_amount = category_totals[
    top_category
]

# Highest month

highest_month = max(
    monthly_totals,
    key=monthly_totals.get
)

highest_month_expense = monthly_totals[
    highest_month
]

# Lowest month

lowest_month = min(
    monthly_totals,
    key=monthly_totals.get
)

lowest_month_expense = monthly_totals[
    lowest_month
]

# Average daily expense

average_expense = (
    total_expense /
    len(date_totals)
)

# Top category percentage

top_category_percent = (
    top_category_amount /
    total_expense
) * 100

# Final analytics object

analytics = {

    "totalExpense":
        round(total_expense, 2),

    "transactionCount":
        transaction_count,

    "topCategory":
        top_category,

    "topCategoryAmount":
        round(top_category_amount, 2),

    "topCategoryPercent":
        round(top_category_percent, 2),

    "averageExpense":
        round(average_expense, 2),

    "highestMonth":
        highest_month,

    "highestMonthExpense":
        round(highest_month_expense, 2),

    "lowestMonth":
        lowest_month,

    "lowestMonthExpense":
        round(lowest_month_expense, 2),

    "categoryTotals":
        category_totals,

    "monthlyTotals":
        monthly_totals
}

# Save analytics JSON

with open("analytics.json", "w") as json_file:

    json.dump(
        analytics,
        json_file,
        indent=4
    )

print("Analytics generated successfully!")