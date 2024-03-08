前端3.0
 1.下载 node js  v16.20 ;;https://nodejs.org/dist/v16.20.0/
 2.、取消ssl验证：

npm config set strict-ssl false

这个方法一般就可以解决了。


2、更换npm镜像源：

npm config set registry http://registry.cnpmjs.org
npm config set registry http://registry.npm.taobao.org

3. npm install --legacy-peer-deps

