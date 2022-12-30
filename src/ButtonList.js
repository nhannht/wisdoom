import {Demo} from "./Demo";

export const ButtonList = ({number}) => {
    return (
        <div>
            {Array.from({length: number}, (_, i) => (
                <Demo key={i}/>
            )
            )}
        </div>
    );
}
