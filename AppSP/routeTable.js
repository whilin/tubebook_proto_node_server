var routes = require('../bc_modules/routes');
var express = require('express');

module.exports.mappingRouteTable = function InstallRouteTable(app) {
    routes(app)
        .defineRoutes('/hello', require('./api/hello'))
        //.defineRoutes('/mydb', require('./mongo_test'))
        
        .defineRoutes('/upload_pose_report', require('./api/cloud/upload_pose_report'))
        .defineRoutes('/get_pose_report',   require('./api/cloud/get_pose_report'))
        .defineRoutes('/get_pose_image',    require('./api/cloud/get_pose_image'))
        
        .defineRoutes('/create_member',     require('./api/member/create_member'))
        .defineRoutes('/get_member',        require('./api/member/get_member'))
        .defineRoutes('/post_pose_exam',        require('./api/member/post_pose_exam'))
        .defineRoutes('/get_member_profile_list',        require('./api/member/get_member_profile_list'))
        .defineRoutes('/update_member_profile',        require('./api/member/update_member_profile'))
       
       
        .defineRoutes('/shop_login',        require('./api/shop/shop_login'))
       
        
        .map();
}
