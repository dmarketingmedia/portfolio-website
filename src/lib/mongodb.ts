import mongoose from 'mongoose';import dns from 'dns';// আপনার ISP বা নেটওয়ার্কের সমস্যা এড়াতে গুগল ডিএনএস সেট করা হচ্ছে

dns.setServers(['8.8.8.8', '1.1.1.1']);const MONGODB_URI = process.env.MONGODB_URI;if (!MONGODB_URI) {

throw new Error(

'Please define the MONGODB_URI environment variable inside .env.local'

);

}interface GlobalMongoose {

conn: typeof mongoose | null;

promise: Promise<typeof mongoose> | null;

}declare global {

var mongoose: GlobalMongoose | undefined;

}let cached = global.mongoose;if (!cached) {

cached = global.mongoose = { conn: null, promise: null };

}async function dbConnect() {

if (cached!.conn) {

return cached!.conn;

}



if (!cached!.promise) {

const opts = {

bufferCommands: false,

// আপনার নেটওয়ার্কের জন্য এই অপশনগুলো যোগ করা হয়েছে

family: 4,

serverSelectionTimeoutMS: 10000, // ১০ সেকেন্ড পর্যন্ত কানেকশনের চেষ্টা করবে

socketTimeoutMS: 45000,

};



cached!.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {

console.log('✅ MongoDB Connected Successfully to D Marketing Mafia Database');

return mongooseInstance;

});

}


try {

cached!.conn = await cached!.promise;

} catch (e) {

cached!.promise = null;

console.error('❌ MongoDB Connection Error:', e);

throw e;

}



return cached!.conn;

}export default dbConnect;