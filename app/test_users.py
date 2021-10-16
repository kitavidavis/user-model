from django.test import TestCase
from django.contrib.auth.models import User
import json

test_user = {"username": "admin", "password": "test"}


class UsersTest(TestCase):
    def setUp(self):
        new_user = User.objects.create(username=test_user["username"])
        new_user.set_password(test_user["password"])
        new_user.save()

    def get_token(self):
        res = self.client.post('/api/token/',
                               data=json.dumps({
                                   'username': test_user["username"],
                                   'password': test_user["password"],
                               }),
                               content_type='application/json',
                               )
        result = json.loads(res.content)
        self.assertTrue("access" in result)
        return result["access"]

    def test_add_users_forbidden(self):
        res = self.client.post('/users/',
           data=json.dumps({
               'date': "2020-01-01",
               'name': "David Kitavi",
               'email': "daviskitavi98@gmail.com",
               'image': "/uploads/images/daviskitavi-datetime",
               'pdf': "/uploads/files/daviskitavi-datetime",
           }),
           content_type='application/json',
           )
        self.assertEquals(res.status_code, 401)
        res = self.client.post('/users/',
           data=json.dumps({
              'date': "2020-01-02",
               'name': "Peter Walker",
               'email': "peter@yahoo.com",
               'image': "/uploads/images/peter-datetime",
               'pdf': "/uploads/files/peter-datetime",
           }),
           content_type='application/json',
           HTTP_AUTHORIZATION=f'Bearer WRONG TOKEN'
           )
        self.assertEquals(res.status_code, 401)

    def test_add_users_ok(self):
        token = self.get_token()
        res = self.client.post('/users/',
                               data=json.dumps({
                                   'date': "2020-01-01",
                                    'name': "David Kitavi",
                                    'email': "daviskitavi98@gmail.com",
                                    'image': "/uploads/images/daviskitavi-datetime",
                                    'pdf': "/uploads/files/daviskitavi-datetime",
                               }),
                               content_type='application/json',
                               HTTP_AUTHORIZATION=f'Bearer {token}'
                               )
        self.assertEquals(res.status_code, 201)
        result = json.loads(res.content)["data"]
        self.assertEquals(result["date"], '2020-01-01')
        self.assertEquals(result["name"], 'David Kitavi')
        self.assertEquals(result["email"], 'daviskitavi98@gmail.com')
        self.assertEquals(result["image"], '/uploads/images/daviskitavi-datetime')
        self.assertEquals(result["pdf"], '/uploads/files/daviskitavi-datetime')
    #  -------------------------- GET RECORDS -------------------------------------------

    def test_get_records(self):
        token = self.get_token()
        res = self.client.post('/users/',
                               data=json.dumps({
                                   'date': "2020-01-01",
                                    'name': "David Kitavi",
                                    'email': "daviskitavi98@gmail.com",
                                    'image': "/uploads/images/daviskitavi-datetime",
                                    'pdf': "/uploads/files/daviskitavi-datetime",
                               }),
                               content_type='application/json',
                               HTTP_AUTHORIZATION=f'Bearer {token}'
                               )
        self.assertEquals(res.status_code, 201)
        id1 = json.loads(res.content)["data"]["id"]

        res = self.client.post('/users/',
                               data=json.dumps({
                                   'date': "2020-01-01",
                                    'name': "David Kitavi",
                                    'email': "daviskitavi98@gmail.com",
                                    'image': "/uploads/images/daviskitavi-datetime",
                                    'pdf': "/uploads/files/daviskitavi-datetime",
                               }),
                               content_type='application/json',
                               HTTP_AUTHORIZATION=f'Bearer {token}'
                               )
        self.assertEquals(res.status_code, 201)
        id2 = json.loads(res.content)["data"]["id"]

        res = self.client.get('/users/',
                              content_type='application/json',
                              HTTP_AUTHORIZATION=f'Bearer {token}'
                              )

        self.assertEquals(res.status_code, 200)
        result = json.loads(res.content)["data"]
        self.assertEquals(len(result), 2)  # 2 records
        self.assertTrue(result[0]["id"] == id1 or result[1]["id"] == id1)
        self.assertTrue(result[0]["id"] == id2 or result[1]["id"] == id2)

        res = self.client.get(f'/users/{id1}/',
                              content_type='application/json',
                              HTTP_AUTHORIZATION=f'Bearer {token}'
                              )
        self.assertEquals(res.status_code, 200)
        result = json.loads(res.content)["data"]
        self.assertEquals(result["date"], '2020-01-01')
        self.assertEquals(result["name"], 'David Kitavi')
        self.assertEquals(result["email"], 'daviskitavi98@gmail.com')
        self.assertEquals(result["image"], '/uploads/images/daviskitavi-datetime')
        self.assertEquals(result["pdf"], '/uploads/files/daviskitavi-datetime')


    #  -------------------------- PUT AND DELETE RECORDS --------------------------------------

    def test_put_delete_records(self):
        token = self.get_token()
        res = self.client.post('/users/',
                               data=json.dumps({
                                  'date': "2020-01-01",
                                    'name': "David Kitavi",
                                    'email': "daviskitavi98@gmail.com",
                                    'image': "/uploads/images/daviskitavi-datetime",
                                    'pdf': "/uploads/files/daviskitavi-datetime",
                               }),
                               content_type='application/json',
                               HTTP_AUTHORIZATION=f'Bearer {token}'
                               )
        self.assertEquals(res.status_code, 201)
        id = json.loads(res.content)["data"]["id"]

        res = self.client.put(f'/users/{id}/',
                               data=json.dumps({
                                   'date': "2020-01-01",
                                    'name': "David Kitavi",
                                    'email': "daviskitavi98@gmail.com",
                                    'image': "/uploads/images/daviskitavi-datetime",
                                    'pdf': "/uploads/files/daviskitavi-datetime",
                               }),
                               content_type='application/json',
                               HTTP_AUTHORIZATION=f'Bearer {token}'
                               )

        self.assertEquals(res.status_code, 200)
        result = json.loads(res.content)["data"]
        self.assertEquals(result["date"], '2020-02-02')

        res = self.client.get(f'/users/{id}/',
                              content_type='application/json',
                              HTTP_AUTHORIZATION=f'Bearer {token}'
                              )
        self.assertEquals(res.status_code, 200)
        result = json.loads(res.content)["data"]
        self.assertEquals(result["date"], '2020-01-01')
        self.assertEquals(result["name"], 'David Kitavi')
        self.assertEquals(result["email"], 'daviskitavi98@gmail.com')
        self.assertEquals(result["image"], '/uploads/images/daviskitavi-datetime')
        self.assertEquals(result["pdf"], '/uploads/files/daviskitavi-datetime')

        res = self.client.delete(f'/users/{id}/',
                              content_type='application/json',
                              HTTP_AUTHORIZATION=f'Bearer {token}'
                              )
        self.assertEquals(res.status_code, 410)  # Gone

        res = self.client.get(f'/users/{id}/',
                              content_type='application/json',
                              HTTP_AUTHORIZATION=f'Bearer {token}'
                              )
        self.assertEquals(res.status_code, 404)