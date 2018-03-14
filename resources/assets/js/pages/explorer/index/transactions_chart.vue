<template>
    <div ref="chart"></div>
</template>

<script>
  import { GoogleCharts } from 'google-charts'

  export default {
    props: ['ledgers'],

    watch: {
      ledgers () {
        this.setupData()
        this.draw()
      },
    },

    methods: {
      setupChart () {
        this.chart = new GoogleCharts.api.visualization.ColumnChart(this.$refs.chart)
      },

      setupData () {
        this.data = new GoogleCharts.api.visualization.DataTable()

        this.data.addColumn('number', 'Ledger Sequence')
        this.data.addColumn('number', 'Transactions')
        this.data.addColumn('number', 'Operations')

        _(this.ledgers).each(ledger => {
          this.data.addRow([
            ledger.sequence,
            ledger.transaction_count,
            ledger.operation_count,
          ])
        })
      },

      draw () {
        this.chart.draw(this.data, this.options);
      },
    },

    mounted () {
      this.options = {
        legend: {
          position: 'none',
        },
        enableInteractivity: false,
          vAxis: {
          format: '#',
            gridlines: {
            color: 'transparent'
          },
          textStyle : {
            fontSize: 9,
          },
          baselineColor: '#555',
        },
        hAxis: {
          gridlines: {
            color: 'transparent'
          },
          textColor: '#ffffff',
        },
        height: 100,
          chartArea: {
          width: '100%',
            height: '100%',
            left: 20,
            top: 10,
            bottom: 10,
        },
        colors: ['#f44336', '#ff9800'],
          isStacked: true
      }

      GoogleCharts.load(this.setupChart, ['corechart', 'bar'])
    }
  }
</script>