angular.module('pagemanager.file_manager')
.factory('$upload_progress', require('./im/upload_progress').default)
.factory('$uploader', require('./im/uploader').default)
.directive('fileUploadButton', require('./im/fileUploadButton').default)
.service('$file_uploader', require('./im/file_uploader').default)

.service('$_file_manager', require('./im/_file_manager').default)

.service('$file_manager', require('./im/file_manager').default)

