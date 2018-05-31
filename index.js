const express=require('express');
const Sequelize=require('sequelize');
const crypto=require('crypto');
const fetch = require('node-fetch');
const bodyParser = require('body-parser')
const cors = require('cors');
var mung = require('express-mung');
require('events').EventEmitter.prototype._maxListeners = 100;

const app=express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


function lowertocamel(data)
{
return JSON.parse(JSON.stringify(data).replace(
                /(_\w)\w+":/g,
                match => match[1].toUpperCase() + match.substring(2)
              ));
}


function camelCaseToSnakeCase(data) {
  if (typeof data != 'object') return data;
  for (var oldKey in data) {
    newKey = oldKey.replace(/([A-Z])/g, function(item) {
      return '_' + item.toLowerCase();
    });
    if (newKey != oldKey) {
      if (data.hasOwnProperty(oldKey)) {
        data[newKey] = data[oldKey];
        delete data[oldKey];
      }
    }
    if (typeof data[newKey] == 'object') {
      data[newKey] = camelCaseToSnakeCase(data[newKey]);
    }
  }
  return data;
}

function snakeCaseToCamelCase(data) {
  if (typeof data != 'object') return data;
    for (var oldKey in data) {
      newKey = oldKey.replace(/(_\w)/g, function(item) {
        return item[1].toUpperCase();
      });
      if (newKey != oldKey) {
        if (data.hasOwnProperty(oldKey)) {
          data[newKey] = data[oldKey];
          delete data[oldKey];
        }
      }
      if (typeof data[newKey] == 'object') {
        data[newKey] = snakeCaseToCamelCase(data[newKey]);
      }
    }
    return data;
}

app.use(function (req,res,next) {
  req.body = snakeCaseToCamelCase(req.body);
  next();
})


app.use(mung.json(
    function transform(body, req, res) {
        body = camelCaseToSnakeCase((JSON.parse(JSON.stringify(body))));
        return body;
    }
));


// app.use(function (req,res,next){
//   console.log("I Am herw");
//   next();
//   res.end();
// });


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
        type: Sequelize.STRING,
        field: 'name'
    },
    email:{
        type: Sequelize.STRING,
         field:'email',
         unique: true
    },
     mobile:{
        type: Sequelize.STRING,
        field:'mobile',
        unique: true
    },
  });
  const Address=sequelize.define('address',{
    street:{
      type:Sequelize.STRING,
      field: 'street'
    },
    city:{
      type:Sequelize.STRING,
      field:'city'
    },
    pincode:{
      type:Sequelize.STRING,
      field:'pincode'
    },
    state:{
      type:Sequelize.STRING,
      field:'state'
    },
  });
const Media=sequelize.define('media',{
  filename:{
    type:Sequelize.STRING,
    field:'filename'
  },
  size:{
    type:Sequelize.STRING,
    field:'filename'
  },
  pic_url:{
    type:Sequelize.STRING,
    field:'pic_url'
  },
});
User.belongsTo(Address);
User.belongsTo(Media);
Address.sync();
Media.sync();
User.sync();

app.post('/register',(req,res)=>{
var{ name,email,mobile,street,city,pincode,filename,size,pic_url}=req.body;
var hash=crypto.createHash('md5').update(name).digest('hex');
if (filename === null || pic_url === null) {
  filename=`https://www.gravatar.com/avatar/${hash}`;
  pic_url=`https://www.gravatar.com/avatar/${hash}`;
}
const url=`https://pincode.saratchandra.in/api/pincode/${pincode}`;
  fetch(url)
     .then(response => {
       response.json().then(json =>{
         if (json.status!=200) {
             res.send('Pincode does not exist');
             return;
         }
      var state=json.data[0].state_name;
      return sequelize.transaction(function (t) {
        return Address.create({
               street:street,
               city:city,
               pin_code:pincode,
               state:state
          },{transaction: t}).then(function (addrres) {
               return Media.create({
               file_name:filename,
               size:size,
               pic_url:pic_url
          }, {transaction: t}).then(function (mediares) {
               return User.create({
                name:name,
                email:email,
                mobile:mobile,
                address_id:addrres.dataValues.id,
                pic_id:mediares.dataValues.id,
         }, {transaction : t}).catch(function(err){
           res.send('Email Address or mobile no already exist')});
        })
       })
   }).then(function (result) {
       res.send(result)
   }).catch(function (err) {
       console.log(err);
   });
  });
     })
     .catch(error =>{
       console.log(err);
     });
})



app.get('/userlist',(req,res,next) =>{
  User.findAll().then(user =>{
    res.send(user);
  })
})

app.post('/deleteuser/:id',(req,res)=>{
  var id=req.body;


  // User.destroy({
  //   where:{
  //     id:id
  //   }
  // }).then(function (result) {
  //    res.json(result+"User Deleted");
  // },function (err) {
  //   console.log(err);
  // })
})

app.get('/',(req,res)=>{
  res.send('IT IS WORKING MAN');
})



app.listen(3001, ()=>{
  console.log('the app is running on port 3001');
})
