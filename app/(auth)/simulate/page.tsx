import { db } from "@/utils/db";
import { UserTable, userFav, blogTools } from "@/utils/schema";


function page() {

    const simpleQuery = async () => {
        const result = await db.query.blogTools.findMany({
            where:(table, funcs) => funcs.eq(table.authorId,"f546d155-de3f-4ef4-9bb3-00e38144ecf2")
        })


    }

    
    async function mergeTables() {
        try {
            const result = await db.query.userFav.findMany({
                where: (favTable, funcs) => funcs.eq(favTable.userId, "f546d155-de3f-4ef4-9bb3-00e38144ecf2"), // Example user ID
                with: {
                    template: true, // Fetch blogTools (the template) related to this favorite
                    // Fetch user data (UserTable) related to this favorite
                }
            });
    
        } catch (error) {
            console.error("Error querying merge table:", error);
        }
    }

    


    // const insertData = async () => {
    //     const result = await db.insert(UserTable).values({
    //         name: "vital",
    //         email: "test@test.com",

    //     }).returning({
    //         id: UserTable.id
    //     })
    //     console.log(result);
    // }

    // const query = async () => {
    //     const result = await db.query.UserTable.findMany({
    //         // columns: { email: true, name: true}
    //         columns: { email: false}

    //     })

    //     console.log(result);

    // }

    // const queryRelation = async () => {
    //     const result = await db.query.UserTable.findMany({
    //         // columns: { email: true, name: true}
    //         columns: { name: true},
    //         with:{prefernces:true}

    //     })

    //     console.log(result);

    // }

    mergeTables()



    return (
        <p>test page</p>
    )
}

export default page
