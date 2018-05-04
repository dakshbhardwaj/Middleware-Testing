const express=require('express');
const Sequelize=require('sequelize');

const app=express();

const sequelize = new Sequelize('interntask2', 'root', 'password', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
      operatorsAliases: false,
});

sequelize.authenticate()
		.then(() => {
			console.log('Connection has been established successfully.');
		})
		.catch((err) => {
			console.log('Unable to connect to the database:', err);
		});

  const User=sequelize.define('user',{
   name:{
        type: Sequelize.STRING
    },
    email:{
        type: Sequelize.STRING
    },
    mobile:{
        type: Sequelize.STRING
    },
  });
  const Address=sequelize.define('address',{
    street:{
      type:Sequelize.STRING
    },
    city:{
      type:Sequelize.STRING
    },
    pincode:{
      type:Sequelize.STRING
    },
    state:{
      type:Sequelize.STRING
    },
  });
const Media=sequelize.define('media',{
  filename:{
    type:Sequelize.STRING
  },
  size:{
    type:Sequelize.STRING
  },
  pic_url:{
    type:Sequelize.STRING
  },
});
User.belongsTo(Address)
User.belongsTo(Media)
Address.sync({force : true}).then ( ()=>{
  console.log('Table Address Created');
  return Address.create({
    street:'Bhagwanpur',
    city:'Muzaffarpur',
    pincode:'842001',
    state:'Bihar'
  })
});
Media.sync({force: true}).then (() =>{
  console.log('Table Media Created');
  return Media.create({
     filename:'abcjpeg',
     size:'250',
     pic_url:'abc.jpeg/dkbha'
  })
});
User.sync({force:true}).then(()=>{
  console.log('Table User Create');
  return User.create({
    name: 'daksh',
    email: 'email',
    mobile: 'mobile',
    pic_id:1,
    address_id:1
  });
})


app.get('/',(req,res)=>{
  res.send('IT IS WORKING MAN');
})

app.listen(3001, ()=>{
  console.log('the app is running on port 3001');
})
