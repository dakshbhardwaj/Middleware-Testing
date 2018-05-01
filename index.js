const express=require('express');
const Sequelize=require('sequelize');

const app=express();

const sequelize = new Sequelize('interntask2', 'root', 'password', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
     operatorsAliases: false,
     define: {
           schema: "core"}
});

sequelize.authenticate()
		.then(() => {
			console.log('Connection has been established successfully.');
		})
		.catch((err) => {
			console.log('Unable to connect to the database:', err);
		});

  const User=sequelize.define('userintern',{
    pid:{
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    address_id :{
      type: Sequelize.INTEGER
    },
    media_id:{
      type: Sequelize.INTEGER
    },
    name:{
        type: Sequelize.STRING
    },
    email:{
        type: Sequelize.STRING
    },
    mobile:{
        type: Sequelize.STRING
    },
    pic_url:{
        type: Sequelize.STRING
    }
  });

  User.sync({force: true}).then(() => {
    console.log('Table Created');
    return User.create({
      pid: 1,
      address_id: 1,
      media_id:1,
      name:'daksh',
      email:'daksh@gmail.com',
      mobile:'+91 7024918941',
      pic_url:'www.ggogle.com'
    });
  });

  const Address=sequelize.define('addressintern',{
    address_id:{
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
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
    }
  });

  Address.sync({force:true}).then( ()=>{
    console.log('Table Address Created');
    return Address.create({
      address_id:1,
      street: 'Bhagwanpur',
      city:'Muzaffarpur',
      pincode:'842001',
      state:'Bihar'
    })
  });
const Media=sequelize.define('mediaintern',{
  media_id:{
    type:Sequelize.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  filename:{
    type:Sequelize.INTEGER
  },
  size:{
    type:Sequelize.INTEGER
  },
  pic_url:{
    type:Sequelize.INTEGER
  }
});
Media.sync({force:true}).then( ()=>{
  console.log('Table Media Created');
  return Media.create({
    address_id:1,
    street: 'Bhagwanpur',
    city:'Muzaffarpur',
    pincode:'842001',
    state:'Bihar'
  })
});

User.all().then(users => {
  console.log(users);
  })


app.get('/',(req,res)=>{
  res.send('IT IS WORKING MAN');
})

app.listen(3001, ()=>{
  console.log('the app is running on port 3001');
})
