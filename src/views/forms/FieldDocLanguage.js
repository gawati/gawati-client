import React from 'react';

export const FieldDocLanguage = ({onChange, value}) =>
  <FormGroup>
  <Label htmlFor="docLang">Language</Label>
  <Input type="select" name="docLang" onChange={onChange} defaultValue={value} id="doclang" required>
    <option value="" disabled >Select a Language</option>
    <option value="eng">English</option>
    <option value="fra">French</option>
    <option value="por">Portoguese</option>
    <option value="spa">Spanish</option>
    <option value="mul">Multilingual</option>
  </Input>
  </FormGroup>;
