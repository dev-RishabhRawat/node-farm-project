////////////////// ******************* File

// const hello  = 'Hello World'; 
// console.log(hello);



// Reading And Writing file synchronously *****************************


// const fs = require('fs');
// const textIn = fs.readFileSync('./txt/input.txt','utf-8');

// const textOut = `${textIn} \n Hello world this is rishabh todays date is ${Date.now()}`;

// fs.writeFileSync('./txt/output.txt',textOut);
// console.log(textIn);
// console.log(textOut);


// Reading And Writing file Asynchronously *****************************


// const fs = require('fs');

// fs.readFile('./txt/start.txt','utf-8',(err,data)=>{
//     console.log(data);
// });

// console.log("reading ............");

// fs.readFile('./txt/start.txt','utf-8',(err,data)=>{
//     fs.readFile(`./txt/${data}.txt`,'utf-8',(err,data2)=>{
//         // console.log(data2);
//         fs.readFile(`./txt/append.txt`,'utf-8',(err,data3)=>{
//             // console.log(data3);
//             fs.writeFile(`./txt/final.txt`,`${data2} ${data3}`,(err)=>{
//                 if(err) throw err;
//                 console.log("Processing Completed all text from two files written to final.txt");
                
//             })
//         })
//     })
// });

// console.log("reading ............");


////////////////// ******************* Server 

const fs = require('fs');
const http = require('http');
const url = require('url');


const replaceTemplate = (temp,product)=>{
   
    let op = temp.replace(/{%ProductName%}/g,product.productName);
    op = op.replace(/{%Image%}/g,product.image);
    op = op.replace(/{%Price%}/g,product.price);
    op = op.replace(/{%From%}/g,product.from);
    op = op.replace(/{%Nutrients%}/g,product.nutrients);
    op = op.replace(/{%Quantity%}/g,product.quantity);
    op = op.replace(/{%Description%}/g,product.description);
    op = op.replace(/{%Id%}/g,product.id);
    if(!product.organic)
    {
        op = op.replace(/{%Not_Organic%}/g,'not-organic');
    } 
        
    return op;
}
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataObj = JSON.parse(data);
const server = http.createServer((req,res)=>{
    // console.log(req.url); // show url
    // console.log(url.parse(req.url));
    const {query,pathname} = url.parse(req.url,true);
    // const pathName = req.url;
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200,{ // 200 status code means ok
            'Content-type':'text/html' // to tell the browser we have sent a html record
        })

        const cardHtml = dataObj.map(el=>replaceTemplate(tempCard,el)).join('');
        const output = tempOverview.replace('{&Product_Card%}',cardHtml);
        res.end(output);

    }else if (pathname === '/product') {
       
        const product = dataObj[query.id]; // if 0 will show first product show on
        res.writeHead(200,{ // 200 status code means ok
            'Content-type':'text/html' // to tell the browser we have sent a html record
        })
        const output = replaceTemplate(tempProduct,product);

        res.end(output);
    }else if (pathname === '/api') {
        fs.readFile(`${__dirname}/dev-data/data.json`,'utf-8',(err,data)=>{
        const productData = JSON.parse(data); // change string data to object in json form 
        // console.log(productData);
        res.writeHead(200,{ // 200 status code means ok
            'Content-type':'application/json' // to tell the browser we have sent a json record
        })
        res.end(data);
        });
    }else{
        res.writeHead(404,{
            'Content-type':'text/html' // now browser will expect html code 
        }); 
        // res.end('Page not found!'); without Content-type
         res.end('<h1>Page not found!</h1>'); // with Content-type

    }
    // res.end("Hello from the server");
})

server.listen(8000,'127.0.0.1',()=>{
    console.log("listening to requests on port 8000");
})







