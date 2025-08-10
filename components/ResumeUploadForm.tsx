import { Input } from "@/components/ui/input"

export default function ResumeUploadForm(){
    return (
        <div>
            <form className="flex flex-center">
                <Input type="file" name="uploadedFile" />
                <button type="submit" className="bg-blue-600">Submit</button>
            </form>
        </div>
    )
}