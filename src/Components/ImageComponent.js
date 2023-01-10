import useImage from 'react-image';

/**
 * @module
 * @component
 * @param imageUrl
 * @returns {JSX.Element}
 * @constructor
 */
export default  function ImageComponent({imageUrl}) {
    const {src} = useImage({
        srcList: imageUrl,
    });
    return <img src={src} />;
}