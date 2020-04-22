import _ from 'lodash';

const DataUtils = {};

DataUtils.convertToChartData = (esResponse, coordinateField, valueField) => {
  const hits = _.get(esResponse, 'hits.hits', []);
  const groupedByLatLong = _.groupBy(hits, (doc) => doc.fields[coordinateField]);
  const chartData = []
  _.each(groupedByLatLong, (resources, key) => {
    const groupedByEntityType = _.groupBy(resources, (doc) => {
      const value = doc.fields[valueField];
      if (value && value.length) {
        return value[0];
      } else {
        return '';
      }
    })
    const locData = [];
    _.each(groupedByEntityType, (res, resourceType) => {
      locData.push({
        type: resourceType,
        value: res.length
      })
    });
    const coordinates = key.split(', ').map(v => parseFloat(v));
    chartData.push({
      coordinates,
      data: locData
    })
  });
  return chartData;
}

export default DataUtils;
