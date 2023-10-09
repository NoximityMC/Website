import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";

export const CustomEditor = ({value, onChange}:{value:any, onChange:any}) => {
    const editorRef = useRef<any>(null);

    return (
        <Editor
            tinymceScriptSrc={"/assets/libs/tinymce/tinymce.min.js"}
            onInit={(evt, editor) => (editorRef.current = editor)}
            value={value}
            init={{
              images_upload_url: '/api/upload',
              automatic_uploads: true,
              height: 500,
              menubar: false,
              plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "code",
                "help",
              ],
              font_size_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
              toolbar:
                "undo redo | blocks | fontsize | " +
                "bold italic forecolor | image | alignleft aligncenter " +
                "alignright alignjustify | bullist numlist outdent indent | " +
                "removeformat | help",
              content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }}
            onEditorChange={onChange}
        />
    )
}