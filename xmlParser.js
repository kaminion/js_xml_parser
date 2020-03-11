const fs = require('fs');
const path = require('path');
const htmlparser2 = require("htmlparser2");
const { connection } = require("./module/dbconnect");


loadOnXML("export (5).xml");


async function loadOnXML(xmlFileName)
{
    let file = null;
    try{
        file = await fs.readFileSync(path.join(__dirname, "./" + xmlFileName));
        XMLData = file.toString("UTF-8");

        let object = null;
        let status = null;
        let buffer = null;
        
        let authorTable = [];
        let author = null;
        
        let arr = [];
        

        const parser = new htmlparser2.Parser({
            onopentag(name, attribs)
            {
                buffer = '';
                status = name;

                if(name == "wp:author" && author == null)
                {
                    author = {};

                }else if(object != null || status == "item")
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
                        case "dc:creator":
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
                }else if(tagname == "item")
                {
                    arr.push(object);
                    object = null;
                }
                if(author != null){
                    author[status] = buffer;
                }
                if(tagname == "wp:author")
                {
                    authorTable.push(author);
                    author = null;
                }
            }

        }, {xmlMode:"true", recognizeCDATA:false});

        // 파싱
        parser.write(XMLData);

        let str = "";

        arr = arr.sort((a, b)=>
        {
            return new Date(b['wp:post_date']) - new Date(a['wp:post_date']);
        });

        arr.map(async (value, index)=>{
           let post_id = index;
           let title = value['title'];
           let content = value['content:encoded'];
           let id = value['dc:creator'];
           let author = "";
           let dateTime = value['wp:post_date'];

           // 게시자명 불러옴
           for(let i=0;i<authorTable.length;i++)
           {
                if(value['dc:creator'] == authorTable[i]['wp:author_login'])
                {
                    author = authorTable[i]['wp:author_login'];
                }
           }

           // QUERY 실행
            await connection.query(`INSERT INTO g5_write_2002 SET wr_id=?, wr_num=?, wr_parent=?, 
                                                            wr_is_comment=?, wr_subject=?, wr_content=?, 
                                                            mb_id=?, wr_name=?, wr_datetime=?, wr_option=?`,
            [post_id, post_id, post_id, 
                0, title, content, 
                id, author, dateTime, "html2"],
            (err, result, fields)=>{
                console.log(err);
                console.log(result);
            });
            connection.close();
        })
        
    }catch(exception)
    {
       
        console.log(exception);
    }



    
}


