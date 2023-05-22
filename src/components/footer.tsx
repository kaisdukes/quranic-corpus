import { forwardRef, Ref } from 'react';
import './footer.scss';

export const Footer = forwardRef<HTMLDivElement, {}>((_, ref) => {
    return (
        <div ref={ref} className='footer'>
            <div>Copyright &copy; <a href='https://www.linkedin.com/in/kaisdukes'>Dr. Kais Dukes</a>, 2009-2023</div>
            <div><a href='https://eps.leeds.ac.uk/computing-applied-computing/staff/33/professor-eric-atwell'>Artificial Intelligence for Language</a></div>
            <div><a href='https://eps.leeds.ac.uk/computing'>University of Leeds</a></div>
        </div>
    )
})