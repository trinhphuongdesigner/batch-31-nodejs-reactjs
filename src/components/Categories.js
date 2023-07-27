import React, { useCallback, useState } from 'react';
import {
  Table,
  Button,
  Form,
  message,
  Alert,
  Popconfirm,
  Space,
  Modal,
} from 'antd';

import CategoryForm from '../components/CategoryForm'
import axiosClient from '../libraries/axiosClient';

const MESSAGE_TYPE = {
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
};

export default function CategoryPage() {
  const [createForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [refresh, setRefresh] = useState(0);

  const onShowMessage = useCallback(
    (content, type = MESSAGE_TYPE.SUCCESS) => {
      messageApi.open({
        type: type,
        content: content,
      });
    },
    [messageApi],
  );

  const onFinish = useCallback(
    async (values) => {
      try {
        console.log('««««« values »»»»»', values);
        debugger;
        const res = await axiosClient.post('/category', {
          ...values,
          isDeleted: false,
        });

        setRefresh((preState) => preState + 1);
        createForm.resetFields();

        onShowMessage(res.data.message);
      } catch (error) {
        if (error?.response?.data?.errors) {
          error.response.data.errors.map((e) =>
            onShowMessage(e, MESSAGE_TYPE.ERROR),
          );
        }
      }
    },
    [createForm, onShowMessage],
  );

  return (
    <>
      {contextHolder}
      <CategoryForm
        form={createForm}
        onFinish={onFinish}
        formName="add-category-form"
        optionStyle={{
          maxWidth: 900,
          margin: '60px auto',
        }}
      />
    </>
  )
}