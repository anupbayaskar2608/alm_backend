import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Department, DepartmentDocument } from './schemas/department.schema';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(@InjectModel(Department.name) private departmentModel: Model<DepartmentDocument>) {}

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    const { department_name, dept_head, dept_members, notes } = createDepartmentDto;

    const deptMembers = [
      { user_id: dept_head, key: 'Department_Head' },
      ...dept_members.map((user_id) => ({ user_id, key: 'Member' })),
    ];

    const createdDepartment = new this.departmentModel({
      department_name,
      dept_members: deptMembers,
      notes,
      isDeleted: false,
    });

    return createdDepartment.save();
  }

  async findAll(): Promise<Department[]> {
    return this.departmentModel.find({ isDeleted: false }).exec();
  }

  async findById(id: string): Promise<Department> {
    const department = await this.departmentModel.findOne({ _id: id, isDeleted: false }).exec();
    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found or has been deleted`);
    }
    return department;
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<Department> {
    const { department_name, dept_headedit, dept_membersedit, notes } = updateDepartmentDto;

    const deptMembers = [
      { user_id: dept_headedit, key: 'Department_Head' },
      ...dept_membersedit.map((user_id) => ({ user_id, key: 'Member' })),
    ];

    const updatedDepartment = await this.departmentModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        { department_name, dept_members: deptMembers, notes },
        { new: true },
      )
      .exec();

    if (!updatedDepartment) {
      throw new NotFoundException(`Department with ID ${id} not found or has been deleted`);
    }

    return updatedDepartment;
  }

  async softDelete(id: string): Promise<void> {
    const result = await this.departmentModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true }, { new: true })
      .exec();
    if (!result) {
      throw new NotFoundException(`Department with ID ${id} not found or already deleted`);
    }
  }
}