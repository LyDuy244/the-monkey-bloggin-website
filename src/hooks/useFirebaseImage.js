import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";

export const useFirebaseImage = (setValue, getValues, userName = "", imageName = null, cb) => {
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState("");

    if (!setValue || !getValues) return;
    const handleDeleteImage = () => {
        // eslint-disable-next-line no-mixed-operators
        if (!imageName && getValues("image_name") === undefined || !getValues("image")) {
            setImage("");
            setProgress(0);
            return;
        }
        const storage = getStorage();
        const imgRef = ref(storage, "images/" + (imageName || getValues("image_name")));
        deleteObject(imgRef)
            .then(() => {
                console.log("Remove image successfully")
                setImage("");
                setProgress(0);
                cb && cb();
            })
            .catch((error) => {
            })
    }
    function extractFileNameAndExtension(filePath) {
        // Tách tên file và đuôi file từ phần cuối cùng của đường dẫn
        const fileNameWithExtension = filePath.split('/').pop(); // Lấy phần cuối cùng của đường dẫn
        const lastDotIndex = fileNameWithExtension.lastIndexOf('.'); // Vị trí của dấu chấm cuối cùng

        if (lastDotIndex === -1) {
            // Trường hợp không có dấu chấm trong tên file
            return { fileName: fileNameWithExtension, extension: '' };
        }

        const fileName = fileNameWithExtension.substring(0, lastDotIndex);
        const extension = fileNameWithExtension.substring(lastDotIndex + 1);
        return { fileName, extension };
    }
    const handleUploadImage = (file) => {
        const storage = getStorage();
        const imageName = extractFileNameAndExtension(file.name)
        const storageRef = ref(storage, 'images/' + imageName.fileName + "-" + userName + "." + imageName.extension);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progressPercent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progressPercent)
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                    default:
                        console.log("Nothing at all")
                }
            },
            (error) => {
                console.log("Error");
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    setImage(downloadURL);
                });
            }
        );
    }

    const handleSelectImage = (e) => {
        if (getValues("image_name") !== undefined) {
            handleDeleteImage();
        }

        const file = e.target.files[0];
        if (!file) return;
        const imageName = extractFileNameAndExtension(file.name)

        setValue("image_name", imageName.fileName + "-" + userName + "." + imageName.extension)
        handleUploadImage(file);
    }

    const handleResetUpload = () => {
        setProgress(0);
        setImage("");
    }

    return {
        handleSelectImage,
        handleDeleteImage,
        progress,
        image,
        setImage,
        handleResetUpload
    }
}