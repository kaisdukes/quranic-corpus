import './footer.scss';

type FooterType = 'mobile' | 'desktop';

type Props = {
    type?: FooterType
}

export const Footer = ({ type }: Props) => {
    return (
        <footer className={type}>
            <div>Copyright &copy; <a href='https://www.linkedin.com/in/kaisdukes'>Dr. Kais Dukes</a>, 2009-2023.</div>
            <div>
                <a href='https://eps.leeds.ac.uk/computing-applied-computing/staff/33/professor-eric-atwell'>Language Research Group</a>, <a href='https://eps.leeds.ac.uk/computing'>University of Leeds.</a>
            </div>
            <div>
                The Quranic Arabic Corpus is <a href='https://github.com/kaisdukes/quranic-corpus/blob/main/LICENSE'>open source</a>.
            </div>
        </footer>
    )
}