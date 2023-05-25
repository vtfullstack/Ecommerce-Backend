// // module.exports=mongoose.connect('mongodb+srv://admin:admin123@cluster0.76idm.mongodb.net/feelwrite51?retrywrites=true&w=majority').then(() => {
//   console.log('Sucessfull db connection');
// });
const mongoose = require("mongoose");
// console.log("Helll-----")
const connectDatabase = () => {
    mongoose
        // .connect(process.env.DB_URI)4
        .connect("mongodb+srv://admin:admin123@cluster0.76idm.mongodb.net/NewEcommerce?retrywrites=true&w=majority")
        .then((data) => {
            console.log(`Mongodb connected with server: ${data.connection.host}`);
        });
};

module.exports = connectDatabase;
