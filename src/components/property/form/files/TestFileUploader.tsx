import { UploadDropzone } from '@/components/ui/upload-dropzone';
import { useUploadFiles } from 'better-upload/client';
interface TestFileUploaderProps {

}

export function TestFileUploader({}:TestFileUploaderProps){
    const { control } = useUploadFiles({
      route: "propertyImages",
    //   onBeforeUpload(data) {
    //     return data.files.map((file) => {
    //         console.log("File to upload:==>> ", file);
    //         return {
    //           ...file,
    //           name: `hello/${file.name}`,
    //         };
    //     });
    //   },
    });

    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <UploadDropzone
          control={control}
          accept="image/*"
          description={{
            maxFiles: 4,
            maxFileSize: "5MB",
            fileTypes: "JPEG, PNG, GIF",
          }}
        />
      </div>
    );
  }

