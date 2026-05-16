const fileInput = document.getElementById("csvFile");

const fileName = document.getElementById("fileName");

let pieChart;
let barChart;

let globalCategoryTotals = {};

fileInput.addEventListener("change", () => {

    fileName.textContent =
        fileInput.files[0]
        ? fileInput.files[0].name
        : "No file selected";
});

async function analyzeFile() {

    const response =
        await fetch("analytics.json");

    const data =
        await response.json();

    animateValue(
        "totalExpense",
        data.totalExpense,
        true
    );

    document.getElementById(
        "topCategory"
    ).textContent =
        data.topCategory;

    animateValue(
        "avgExpense",
        data.averageExpense,
        true
    );

    animateValue(
        "totalTransactions",
        data.transactionCount,
        false
    );

    generateMonthlyCards(
        data.monthlyTotals
    );

    createCharts(
        data.categoryTotals
    );

    generateInsights(data);

    generateCategoryTable(
        data.categoryTotals
    );

    document.getElementById(
        "resultSection"
    ).classList.remove("hidden");
}

function createCharts(categoryTotals){

    const categories =
        Object.keys(categoryTotals);

    const amounts =
        Object.values(categoryTotals);

    if(pieChart) pieChart.destroy();

    if(barChart) barChart.destroy();

    // DOUGHNUT CHART

    pieChart = new Chart(
        document.getElementById("pieChart"),
        {

            type:"doughnut",

            data:{

                labels:categories,

                datasets:[{

    data:amounts,

    backgroundColor:[

        "#1d4ed8",
        "#2563eb",
        "#3b82f6",
        "#60a5fa",
        "#38bdf8",
        "#0ea5e9",
        "#93c5fd"
    ],

    borderColor:"#1e293b",

    borderWidth:2,

    spacing:1,

    hoverOffset:12
}]
            },

            options:{

                cutout:"70%",

                plugins:{

                    legend:{

                        position:"bottom",

                        labels:{
                            color:"#cbd5e1",
                            padding:20,
                            font:{
                                size:13
                            }
                        }
                    }
                }
            }
        }
    );

    // BAR CHART

    barChart = new Chart(
        document.getElementById("barChart"),
        {

            type:"bar",

            data:{

                labels:categories,

datasets:[{

    label:"Expense Amount",

    data:amounts,

    backgroundColor:"#3b82f6",

    hoverBackgroundColor:"#60a5fa",

    borderRadius:12,

    borderSkipped:false
}]
            },

            options:{

                plugins:{

                    legend:{
                        display:false
                    }
                },

                scales:{

                    x:{

                        ticks:{
                            color:"#cbd5e1"
                        },

                        grid:{
                            display:false
                        }
                    },

                    y:{

                        ticks:{
                            color:"#cbd5e1"
                        },

                        grid:{
                            color:"#334155"
                        }
                    }
                }
            }
        }
    );
}

function generateInsights(data){

    const insights =
        document.getElementById("insights");

    insights.innerHTML = `

        <li>
            Total expenses recorded:
            <strong>
                ₹${data.totalExpense}
            </strong>
            across
            <strong>
                ${data.transactionCount}
            </strong>
            transactions.
        </li>

        <li>
            Highest spending category was
            <strong>
                ${data.topCategory}
            </strong>
            contributing
            <strong>
                ${data.topCategoryPercent}%
            </strong>
            of total expenses.
        </li>

        <li>
            Highest monthly spending occurred in
            <strong>
                ${data.highestMonth}
            </strong>
            with expenses of
            <strong>
                ₹${data.highestMonthExpense}
            </strong>.
        </li>

        <li>
            Lowest spending occurred in
            <strong>
                ${data.lowestMonth}
            </strong>
            with expenses of
            <strong>
                ₹${data.lowestMonthExpense}
            </strong>.
        </li>

        <li>
            Average daily expense was
            <strong>
                ₹${data.averageExpense}
            </strong>.
        </li>
    `;
}

function generateCategoryTable(categoryTotals){

    const tableBody =
        document.getElementById("categoryTable");

    tableBody.innerHTML = "";

    for(let cat in categoryTotals){

        tableBody.innerHTML += `

            <tr>
                <td>${cat}</td>

                <td>
                    ₹${categoryTotals[cat].toFixed(2)}
                </td>
            </tr>
        `;
    }
}

function generateMonthlyCards(monthlyTotals){

    const monthlyContainer =
        document.getElementById("monthlySummary");

    monthlyContainer.innerHTML = "";

    for(let month in monthlyTotals){

        monthlyContainer.innerHTML += `
            <div class="month-card">
                <h4>${month}</h4>

                <p>
                    ₹${monthlyTotals[month].toFixed(2)}
                </p>
            </div>
        `;
    }
}

function animateValue(id,value,currency){

    let start = 0;

    const duration = 1000;

    const increment = value / 50;

    const element =
        document.getElementById(id);

    const timer = setInterval(() => {

        start += increment;

        if(start >= value){

            start = value;

            clearInterval(timer);
        }

        element.textContent =
            currency
            ? `₹${start.toFixed(2)}`
            : Math.floor(start);

    }, duration / 50);
}

function resetPage(){

    fileInput.value = "";

    fileName.textContent =
        "No file selected";

    document.getElementById("resultSection")
        .classList.add("hidden");

    if(pieChart) pieChart.destroy();

    if(barChart) barChart.destroy();
}