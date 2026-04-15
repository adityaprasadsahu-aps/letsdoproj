const mongoose = require('mongoose');
const conn = 'mongodb://adityasaahu_db_user:QYYzk8nNhY7pJ7I5@ac-0x3xb9x-shard-00-00.4tjktih.mongodb.net:27017,ac-0x3xb9x-shard-00-01.4tjktih.mongodb.net:27017,ac-0x3xb9x-shard-00-02.4tjktih.mongodb.net:27017/mydb?ssl=true&replicaSet=atlas-zpcxb2-shard-0&authSource=admin&appName=Etech';
const schema = new mongoose.Schema({ id:Number, name:String, series:String, seriesKey:String }, { collection: 'products' });
const Product = mongoose.model('Product', schema);
(async () => {
  try {
    await mongoose.connect(conn);
    const series = 'signature';
    const filterExact = { $or: [{ seriesKey: series.toLowerCase() }, { series: { $regex: new RegExp('^' + series + '$', 'i') } }] };
    const exact = await Product.find(filterExact);
    console.log('exact count', exact.length);
    const filterSubstring = { $or: [{ seriesKey: series.toLowerCase() }, { series: { $regex: new RegExp(series, 'i') } }] };
    const substring = await Product.find(filterSubstring);
    console.log('substring count', substring.length);
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();