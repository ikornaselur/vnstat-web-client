angular.module('vnstatApp').controller('mainCtrl', ['stats', function (stats) {
  var that = this;
  var daysInMonth = function (year, month) {
    return new Date(year, month, 0).getDate();
  }

  stats.get(function success(data) {
    that.stats = [];
    for (iface in data) {
      if (iface === 'eth0') {
        var all_days = data[iface].traffic.days;

        // Only have the days in the current month
        var current_month = (new Date()).getMonth() + 1;
        var days = all_days.filter(function (element) {
          return element.date.month === current_month;
        });

        days.sort(function (a, b) {
          return a.date.day - b.date.day;
        });
        var year = days[0].date.year;
        var month = days[0].date.month;
        var numDays = daysInMonth(year, month);

        // Fill first few days with empty stats
        var daysStats = [];
        for (var i = 1; i < days[0].date.day; i++) {
          daysStats.push({
            date: {
              year: year,
              month: month,
              day: i
            },
            rx: 0,
            tx: 0,
            type: 'filler'
          });
        }

        // Mark real data as actual
        for (var day in days) {
          days[day].type = 'actual';
        }

        // Do a naive estimation
        var estStats = [];
        var totalRx;
        var totalTx;
        var i;
        var months_arr = data[iface].traffic.months
        for (i = 0; i < months_arr.length; i++) {
          if (months_arr[i].date.month === current_month) {
            totalRx = months_arr[i].rx;
            totalTx = months_arr[i].tx;
            break;
          }
        }

        var totalDays = days.length + daysStats.length;
        var avgRx = totalRx/totalDays;
        var avgTx = totalTx/totalDays;

        for (var x = totalDays+1; x < numDays; x++) {
          estStats.push({
            date: {
              year: year,
              month: month,
              day: x
            },
            rx: avgRx,
            tx: avgTx,
            type: 'estimation'
          });
        }
        var stat = {
          days: daysStats.concat(days).concat(estStats), 
          total: totalTx,
          id: iface
        };

        stat.days[0].totalRxSoFar = stat.days[0].rx;
        stat.days[0].totalTxSoFar = stat.days[0].tx;
        for (var y = 1; y < stat.days.length; y++) {
          stat.days[y].totalRxSoFar = stat.days[y-1].totalRxSoFar + stat.days[y].rx;
          stat.days[y].totalTxSoFar = stat.days[y-1].totalTxSoFar + stat.days[y].tx;
        }
        that.stats.push(stat);
      }
    }
  });
}]);
