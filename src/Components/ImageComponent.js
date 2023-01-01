import useImage from 'react-image';

export default  function ImageComponent({imageUrl}) {
    const {src} = useImage({
        srcList: imageUrl,
    });
    return <img src={src} />;
}