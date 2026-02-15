import { useState } from 'react';
import { supabase } from '@/supabase/config';

interface UploadResult {
    url: string | null;
    error: string | null;
    isUploading: boolean;
    uploadFile: (file: File) => Promise<string | null>;
}

export const useSupabaseUpload = (bucketName: string = 'post-images'): UploadResult => {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [url, setUrl] = useState<string | null>(null);

    const uploadFile = async (file: File): Promise<string | null> => {
        setIsUploading(true);
        setError(null);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from(bucketName)
                .getPublicUrl(filePath);

            setUrl(publicUrl);
            return publicUrl;
        } catch (err: any) {
            console.error('Upload error:', err);
            setError(err.message || 'Error uploading file');
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    return { url, error, isUploading, uploadFile };
};
