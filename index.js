const express=require('express');
const Sequelize=require('sequelize');

const app=express();



app.get('/',(req,res)=>{
  res.send('IT IS WORKING MAN');
})
app.listen(3000, ()=>{
  console.log('the app is running on port 3000');
})
