export default[
    {
        name:'Blog Title',
        desc:' an ai tool that generate blog titles',
        category:'Blog',
        icon:'',
        aiPrompt:'give me 5 blog topic idea in bullet wise only based on given niche & outline and give me the result in rich text editor format',
        slug:'generate-blog-title',
        form:[
            {
                label:'Enter Your Blog Nich',
                field:'input',
                name:'niche',
                required:true
            },
        ]
    }
]