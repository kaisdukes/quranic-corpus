import { Fragment } from 'react';

type Props = {
    content: string[]
}

export const TestView = ({ content }: Props) => {
    return (
        <>
            {content.map((line, index) => (
                <Fragment key={index}>
                    {line}
                    <br />
                </Fragment>
            ))}
        </>
    )
}