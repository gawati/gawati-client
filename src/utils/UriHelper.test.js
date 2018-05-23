import {aknIri, normalizeDocNumber} from './UriHelper';

it('generates iris', () => {
    expects(
        aknIri('mu', '2006-02-02', 'doc_01_f4-2', 'eng', 'main')
    ).toEqual('/akn/mu/2006-02-02/doc_01_f4-2/eng@/!main');
});
