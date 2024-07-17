
const express=require('express');
const fs=require("fs");
const users=require("./MOCK_DATA.json");

const app=express();


 


const port=8000;
app.use(express.urlencoded({extended:false}));//middleware pluggin.


app.use((req,res,next)=>{
    console.log("Hello from Middleware 1");
    next();
})
app.use((req,res,next)=>{
    fs.appendFile('log.txt',`${Date.now()},${req.method},${req.path} Printing all these through a middleware`,(err,data)=>{
        next();

    })
   
})

app.get('/api/users',(req,res)=>{
    res.setHeader("Xmyname","Piyush Garg")//custom headers vs builtin headers, add X- to custom headers for better clarification in production
    return res.json(users)
})
app.get('/users',(req,res)=>{
    const html=`<ul>
    
        ${users.map(user=>`<li>${user.first_name}</li>`).join("")}
    </ul>
    `
    res.send(html);
    
    
    
})
app.get('/api/users/:id',(req,res)=>{
    const id=Number(req.params.id);
    const user=users.find(user=>user.id===id)
    if(!user){ return res.status(404).json({msg:"ID not availble"})}
    return res.json(user);
})
app.get('/users/:id',(req,res)=>{
    const id=Number(req.params.id);//id ko user se get karna hai
    const user=users.find(user=>user.id===id)
    res.send( `<p>${user.id}</p>
    <p>${user.first_name}</p>
    <p>${user.last_name}</p>
    <p>${user.email}</p>
    <p>${user.gender}</p>

    `);

    
})


app.post('/api/users', (req, res) => {
    
    const body = req.body;
    if(!body && !body.first_name || !body.last_name || !body.email ||!body.gender || !body.job_title){
        return res.status(404).json({msg:"All fields are required"})
    }
    users.push({...body, id: users.length + 1})
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
        return res.status(201).json({status: "Success", id: users.length})
    })
})


   

   

app.listen(port,()=>{
    console.log("Listening")
})
