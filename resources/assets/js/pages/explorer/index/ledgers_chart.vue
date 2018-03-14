<template>
    <div ref="chart"></div>
</template>

<script>
  import { GoogleCharts } from 'google-charts'
  import moment from 'moment'

  export default {
    props: ['ledgers'],

    data: () => ({
      lastClose: null,
    }),

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
        this.data.addColumn('number', 'Close Time')

        this.lastClose = moment(this.ledgers[0].closed_at)

        _(this.ledgers).each(ledger => {
          this.data.addRow([
            ledger.sequence,
            -moment(ledger.closed_at).diff(this.lastClose, 'seconds')
          ])

          this.lastClose = moment(ledger.closed_at)
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
            count: 11,
              color: 'transparent'
          },
          viewWindow:{
            max:10,
              min:0
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
        colors: ['#2196f3'],
      }

      GoogleCharts.load(this.setupChart, ['corechart', 'bar'])
    }
  }
</script>