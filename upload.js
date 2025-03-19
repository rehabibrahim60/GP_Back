import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv'

dotenv.config()
// // Configuration
// cloudinary.config({ 
//     cloud_name: process.env.CLOUD_NAME, 
//     api_key: process.env.API_KEY, 
//     api_secret: process.env.API_SECRET // Click 'View API Keys' above to copy your API secret
// });
    
// export default cloudinary

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET // Click 'View API Keys' above to copy your API secret
  });
  
  async function run (){
    try{
      const result =await new Promise((resolve , reject )=> {
        cloudinary.uploader.upload_chunked("D://copied from c//Videos//Captures//screen recorder for pc windows 10 - بحث Google‏ - Google Chrome 2024-04-15 01-14-33.mp4" ,{
        resourse_type : 'video'},(err , result)=>{
        if(err){
            reject(err)
        }
        resolve(result)
      })
    })
      console.log(result.secure_url);
      
    }catch(err){
      console.log(err);
      
    }
  }
  
  run()