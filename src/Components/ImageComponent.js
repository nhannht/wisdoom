import useImage from 'react-image';

/**
 * @module
 * @category KnowledgeDashboard
 * @param imageUrl
 * @returns {JSX.Element}
 */
export default  function ImageComponent({imageUrl}) {
    const {src} = useImage({
        srcList: imageUrl,
    });
    return <img src={src} />;
}