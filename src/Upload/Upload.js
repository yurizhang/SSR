/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import {default as Component} from '../Common/plugs/index.js'; //提供style, classname方法
import UploadList from './UploadList';
import iFrameUpload from './iFrameUpload';
import AjaxUpload from './AjaxUpload';
import '../Common/css/Upload.css'
export default class Upload extends Component {
  state;

  static defaultProps = {
    headers: {},
    name: 'file',
    type: 'select',
    listType: 'text',
    fileList: [],
    showFileList: true,
    autoUpload: true,
    onRemove() {},
    onPreview() {},
    onProgress() {},
    onSuccess() {},
    onError() {},
    onChange() {}
  };

  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      tempIndex: 1
    };
  }

  componentWillMount() {
    this.init(this.props);
  }

  init(props) {
    let { tempIndex } = this.state;
    const { fileList } = props;
    const uploadFiles = fileList.map(file => {
      file.uid = file.uid || Date.now() + tempIndex++;
      file.status = 'success';
      return file;
    });
    this.setState({ fileList: uploadFiles });
  }

  getChildContext() {
    return {
      onPreview: this.handlePreview.bind(this),
      onRemove: this.handleRemove.bind(this)
    };
  }

  getFile(file) {
    if (file) {
      return this.state.fileList.find(item => item.uid === file.uid);
    }

    return null;
  }

  handleStart(file) {
    let { tempIndex, fileList } = this.state;

    file.uid = Date.now() + tempIndex++;

    let _file = {
      status: 'ready',
      name: file.name,
      size: file.size,
      percentage: 0,
      uid: file.uid,
      raw: file
    };

    try {
      _file.url = URL.createObjectURL(file);
    } catch (err) {
      return;
    }

    fileList.push(_file);
    this.setState({
      fileList,
      tempIndex
    });
  }

  handleProgress(e, file) {
    const { fileList } = this.state;
    let _file = this.getFile(file);
    if (_file) {
      _file.percentage = e.percent || 0;
      _file.status = 'uploading';
      this.props.onProgress(e, _file, fileList);
      this.setState({ fileList });
    }
  }

  handleSuccess(res, file) {
    const { fileList } = this.state;
    let _file = this.getFile(file);
    if (_file) {
      _file.status = 'success';
      _file.response = res;

      setTimeout(
        () => {
          this.setState({ fileList }, () => {
            this.props.onSuccess(res, _file, fileList);
            this.props.onChange(_file, fileList);
          });
        },
        1000
      );
    }
  }

  handleError(err, file) {
    const { fileList } = this.state;
    let _file = this.getFile(file);
    if (_file) {
      _file.status = 'fail';
      fileList.splice(fileList.indexOf(_file), 1);
      this.setState({ fileList }, () => {
        this.props.onError(err, _file, fileList);
        this.props.onChange(_file, fileList);
      });
    }
  }

  handleRemove(file) {
    const { fileList } = this.state;
    let _file = this.getFile(file);
    if (_file) {
      fileList.splice(fileList.indexOf(_file), 1);
      this.setState({ fileList }, () => this.props.onRemove(file, fileList));
    }
  }

  handlePreview(file) {
    if (file.status === 'success') {
      this.props.onPreview(file);
    }
  }

  clearFiles() {
    this.setState({
      fileList: []
    });
  }

  submit() {
    this.state.fileList
      .filter(file => file.status === 'ready')
      .forEach(file => {
        this.refs['upload-inner'].upload(file.raw, file);
      });
  }

  showCover() {
    const { fileList } = this.state;
    const file = fileList[fileList.length - 1];
    return file && file.status !== 'fail';
  }

  render(){
    const { fileList } = this.state;
    const {
      showFileList,
      autoUpload,
      drag,
      tip,
      action,
      multiple,
      beforeUpload,
      withCredentials,
      headers,
      name,
      data,
      accept,
      listType,
      className
    } = this.props;
    let uploadList;
    if (showFileList && fileList.length) {
      uploadList = <UploadList listType={listType} fileList={fileList} />;
    }
    const restProps = {
      autoUpload,
      drag,
      action,
      multiple,
      beforeUpload,
      withCredentials,
      headers,
      name,
      data,
      accept,
      listType,
      onStart: this.handleStart.bind(this),
      onProgress: this.handleProgress.bind(this),
      onSuccess: this.handleSuccess.bind(this),
      onError: this.handleError.bind(this),
      onPreview: this.handlePreview.bind(this),
      onRemove: this.handleRemove.bind(this),
      showCover: this.showCover(),
      ref: 'upload-inner'
    };
    const trigger = this.props.trigger || this.props.children;
    const uploadComponent = typeof FormData !== 'undefined'
      ? <AjaxUpload key="AjaxUpload" {...restProps}>{trigger}</AjaxUpload>
      : <iFrameUpload key="iFrameUpload" {...restProps}>{trigger}</iFrameUpload>;
    return (
      <div className={className}>
        {listType === 'picture-card' ? uploadList : ''}
        {this.props.trigger
          ? [uploadComponent, this.props.children]
          : uploadComponent}
        {tip}
        {listType !== 'picture-card' ? uploadList : ''}
      </div>
    );
  }
}

Upload.childContextTypes = {
  onPreview: PropTypes.func,
  onRemove: PropTypes.func
};

Upload.propTypes = {
  action: PropTypes.string.isRequired,
  headers: PropTypes.object,
  data: PropTypes.object,
  multiple: PropTypes.bool,
  name: PropTypes.string,
  withCredentials: PropTypes.bool,
  showFileList: PropTypes.bool,
  fileList: PropTypes.array,
  autoUpload: PropTypes.bool,
  accept: PropTypes.string,
  drag: PropTypes.bool,
  listType: PropTypes.oneOf(['text', 'picture', 'picture-card']),
  tip: PropTypes.node,
  trigger: PropTypes.node,
  beforeUpload: PropTypes.func,
  onRemove: PropTypes.func,
  onPreview: PropTypes.func,
  onProgress: PropTypes.func,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  onChange: PropTypes.func,
  className: PropTypes.string
};
