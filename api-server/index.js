const express = require("express");
const {generateSlug} = require("random-word-slugs");
const { ECSClient , RunTaskCommand} = require("@aws-sdk/client-ecs")
const app = express();
const PORT = 9000;
const cors = require("cors");

app.use(cors());

app.use(express.json())

const ecsClient = new ECSClient({
    region : '',
    credentials: {
        accessKeyId: '',
        secretAccessKey: ''
    }
})

const config ={
    CLUSTER :'',
    TASK : ''
}

app.post("/project",async (req,res)=>{
    const { gitURL,slug } = req.body;
    const projectSlug = slug ? slug : generateSlug();

    // spin the container
    const command = new RunTaskCommand({
        cluster: config.CLUSTER,
        taskDefinition : config.TASK,
        launchType : 'FARTGATE',
        count : 1,
        networkConfiguration: {
            awsvpcConfiguration: {
                assignPublicIp: '',
                subnets: ['', '', ''],
                securityGroups: ['']
            }
        },
        overrides: {
            containerOverrides: [
                {
                    name: '',
                    environment: [
                        { name: 'GIT_REPOSITORY__URL', value: gitURL },
                        { name: 'PROJECT_ID', value: projectSlug }
                    ]
                }
            ]
        }

    })
    await ecsClient.send(command); 

    return res.json({ status: 'queued', data: { projectSlug, url: `http://${projectSlug}.localhost:8000` } })
})


app.listen(PORT,()=> console.log(`API Server Running.. ${PORT}`))