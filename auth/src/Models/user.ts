import mongoose from 'mongoose';
import { Password } from '../Services/password';

//An interface that describe the properties/attibutes
//that requires a new user
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describe the properties
//that a User Model has (collection record)
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describe the properties
// that a User Document has (single record)

interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      // String with uppercase mean we refer to a mongoose constructor, no tie with typescipt
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    // usualy in a MVC, modifing the response would be done in the 'VUE' front-end part
    // it's done here for the purpose of the course
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

//use name function instead of arrow function so the bind to this
userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});
//instead of creating a new User directly with mongoose as it should be without typescript
//we call a function with argument 'attrs' set strict by the interface of 'UserAttrs'
//pass the arument in the new User instantiated
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};
//create a class of User including the 'userSchema'
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
