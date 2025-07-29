'use client'
import { Card } from "@/components/ui/card";
import { useCallback, useState } from "react";
import { Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import Markdown from 'react-markdown'
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeSanitize from 'rehype-sanitize';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import remarkEmoji from "remark-emoji";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

export default function Home() {
  const [loading,setLoading] =  useState(false);
  const [uploadProgress,setUploadProgress] = useState(false);
  const [error,setError] = useState<string>("");
  const [summary,setSummary] = useState<string>("");
  const onDrop = useCallback(async (acceptedFiles:File[]) => {
    try {
      setError("") // empty
      setUploadProgress(true);
      const formData = new FormData();//FormData object, which is used to send multipart/form-data in HTTP POST requests — necessary for file uploads.
      formData.append("file",acceptedFiles[0]);

      const response = await fetch("/api/upload" , {
        method:"POST",
        body:formData,
      });

      if(!response.ok){
        throw new Error("failed while uploadig file")
      }
      const data = await response.json();
      setSummary(data.summary);

    } catch (error) {
      setError(error instanceof Error ? error.message:"Unidentified Error Occured");//Error Class hai Of JS
    }finally{
      setUploadProgress(false);
    }
    
  } , []);

      const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
          "application/pdf": [".pdf"]
        },
        maxSize: 20 * 1024 * 1024 // 20 MB
      });






  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1>Policy Docs Assistant</h1>
        <div>{/* Add theme toggle */}</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
           <Card className="p-6 mb-8">
            <div   {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-blue-500"
                  : "border-gray-300 dark:border-gray-700"
              }`}>
              <input {...getInputProps()} />
              {uploadProgress ? ( <div className="flex justify-center items-center gap-3">
                <Loader2 className="animate-spin size-6"/>
                <p>Please wait while document is in processing</p>
              </div>) : <p> Drag and Drop Files here or click to select </p>}
            </div>
           </Card>
           {error && 
            (<div className="bg-red-200 text-red-600 p-4 rounded-lg mb-4">{error}</div>)}

           {summary && (
                <Card>
                  <h2 className="text-xl font-bold mb-4">Document Summary</h2>
                  <p className="text-gray-500 dark:text-gray-200 leading-relaxed">
                    <Markdown remarkPlugins={[remarkGfm, remarkMath, remarkParse, remarkEmoji]} rehypePlugins={[rehypeKatex,  rehypeHighlight, rehypeSanitize, rehypeStringify,rehypeSlug, rehypeAutolinkHeadings]}>
                                {summary.trim()}
                    </Markdown>
                  </p>
                </Card>
              )}
        </div>
      </div>
    </div>

  );
}
