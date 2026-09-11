import React from 'react';
import Select from './Select';
import { CLASS_OPTIONS } from '../../constants/classOptions';
import { useLanguage } from '../../context/LanguageContext';

const ClassSelect = ({
  value,
  onChange,
  error,
  disabled = false,
  className = '',
  placeholder,
  ...props
}) => {
  const { t } = useLanguage();
  return (
    <Select
      label={t('classLabel')}
      value={value}
      onChange={onChange}
      error={error}
      disabled={disabled}
      className={className}
      {...props}
    >
      <option value="">{placeholder || t('allClasses')}</option>
      {CLASS_OPTIONS.map((grade) => (
        <option key={grade} value={grade}>
          {t(grade) || grade}
        </option>
      ))}
    </Select>
  );
};

export default ClassSelect;
