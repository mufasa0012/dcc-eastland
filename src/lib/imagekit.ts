
import ImageKit from 'imagekit';

let imagekit: ImageKit | undefined;

try {
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

  if (urlEndpoint && publicKey && privateKey) {
    imagekit = new ImageKit({
      urlEndpoint: urlEndpoint,
      publicKey: publicKey,
      privateKey: privateKey,
    });
    console.info("ImageKit initialized successfully.");
  } else {
    const missing = [
      !urlEndpoint ? 'NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT' : null,
      !publicKey ? 'NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY' : null,
      !privateKey ? 'IMAGEKIT_PRIVATE_KEY' : null,
    ]
      .filter(Boolean)
      .join(', ');
    console.warn(`ImageKit is not configured. Missing environment variables: ${missing}. Image upload functionality will be disabled.`);
  }
} catch (error) {
    console.error("Failed to initialize ImageKit:", error);
}

export {imagekit};
