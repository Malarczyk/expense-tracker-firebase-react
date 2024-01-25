import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  animation: {
    duration: 0
  },
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false, // Ukrywanie linii pionowych
      },
      border: {
        color: '#D4D4D4',
      }
    },
    y: {
      beginAtZero: true,
      ticks: {
        callback: function (value, index, values) {
          // Ustawianie koloru linii dla 0 na przezroczysty
          return index === 0 ? '' : value;
        }
      },
      grid: {
        color: '#D4D4D4', // Kolor linii poziomych
      },
      border: {
        display: false,
      }
    },
  },
  elements: {
    bar: {
      borderRadius: 3, // Border-radius słupków
    },
  },
};

const labels = ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Przychody',
      data: ['3044', '4100', '3500', '5043', '1000', '4404'],
      backgroundColor: '#54B471',
    },
    {
      label: 'Wydatki',
      data: ['4100', '3210', '2600', '2800', '3000', '3210'],
      backgroundColor: '#E62C59',
    },
  ],
};

export function BarSummary() {
  return (
    <>
      <div className="section__title">
        <h1>Podsumowanie</h1>
        <div>
          <div className="imgWrap">
            <i className="icon icon--arrow-left"></i>
          </div>
          <div className="imgWrap">
            <i className="icon icon--arrow-right"></i>
          </div>
        </div>
      </div>

      <div className="stats__chart stats__chart--bar">
        <div>
          <Bar options={options} data={data} />
        </div>
      </div>
    </>
  )
}