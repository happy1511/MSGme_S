const { uploader } = require("cloudinary").v2;

const uploadToCloudinary = async (base64Content) => {
  const res = await uploader.upload_large(
    `data:image/png;base64,${base64Content}`,
    {
      folder: "MSGme/Profile",
    }
  );
  return res;
};

const deleteFromCloudinary = async (public_id) => {
  const res = await uploader.destroy(public_id, {
    resource_type: "image",
    type: "upload",
  });
  uploader.update;
  return res;
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
