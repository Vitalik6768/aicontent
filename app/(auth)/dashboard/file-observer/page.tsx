"use client";



import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { FileDialog } from "./_components/FileDialog";
import Link from "next/link";

function Page() {
  const createDocument = useMutation(api.documents.createDocument);
  const documents = useQuery(api.documents.getDocuments); // Fetch documents from query
  const [title, setTitle] = useState("Default Title");


  return (
    <div>
      {/* <Button onClick={handleCreateDocument}>Create Document</Button> */}
      <br />
      <br />
      <br />
      <br />

      <FileDialog />

      <br />
      <br />
      <br />
      <br />



      {/* Render the list of documents */}
      {documents ? (
        <ul>
          {documents.map((doc) => (
            <Link href={`/dashboard/file-observer/${doc._id}`} >
              <li key={doc._id}>{doc.title}</li>

              <p>{doc.description}</p>
            </Link>
          ))}
        </ul>

      ) : (
        <p>Loading documents...</p>
      )}
    </div>
  );
}

export default Page