pip3 install -r requirements.txt
python3 manage.py makemigrations
python3 manage.py migrate
cd client
npm install
npm install --save-dev @babel/core @babel/preset-env @babel/preset-react babel-loader
npm install react-datepicker
npm run build
cd ..