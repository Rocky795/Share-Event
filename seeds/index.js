const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", () => {
  console.log("database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  const c = new Campground({ title: "Delete item try" });
  await c.save();
  for (let x = 0; x < 50; x++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const camp = new Campground({
      author:'61f2d5f1bd33355064432515',
      location: `${cities[random1000].city} ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      images: "https://source.unsplash.com/collection/190727/200*150",
      discription:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus dicta mollitia, numquam molestiae quibusdam praesentium officiis, officia deleniti, dignissimos culpa incidunt non quasi vel perferendis. Temporibus aperiam qui deleniti sint?",
      price: `${random1000}`,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
