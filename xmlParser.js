const fs = require('fs');
const path = require('path');
const htmlparser2 = require("htmlparser2");

loadOnXML("export (7).xml");


async function loadOnXML(xmlFileName)
{
    let file = null;
    try{
        file = await fs.readFileSync(path.join(__dirname, "./" + xmlFileName));
        XMLData = file.toString("UTF-8");

        let object = null;
        let status = null;
        let buffer = null;
        let arr = [];

        const parser = new htmlparser2.Parser({
            onopentag(name, attribs)
            {
                buffer = '';
                status = name;

                if(object != null || status == "item")
                {
                    switch(name)
                    {
                        case "item":
                            object = {};
                            break;
                        case "title":
                            break;
                        case "content:encoded":
                            break;
                        case "wp:post_id":
                            break;
                        case "wp:post_date":
                            break;
                        case "wp:post_type":
                            break;
    
                        default : 
                            status = null;
                            break;
                    }

                }

            },
            ontext(text){
                if(status != null)
                {
                    buffer += text;
                }
            },
            onclosetag(tagname)
            {
                if(object != null && status != null)
                {
                    object[status] = buffer;
                }
                if(tagname == "item")
                {
                    arr.push(object);
                    object = null;
                }
            }

        }, {xmlMode:"true", recognizeCDATA:false});

        // 파싱
        parser.write(XMLData);

        let str = "";
        arr.map((value)=>{
            console.log(value);
            str += `${value['wp:post_id']} ${value['wp:post_type']} ${value['title']} ${value['content:encoded']} ${value['wp:post_date']}`;
        })

        fs.writeFileSync(`./인터뷰.txt`, str);
        
    }catch(exception)
    {
       
        console.log(exception);
    }



    
}


