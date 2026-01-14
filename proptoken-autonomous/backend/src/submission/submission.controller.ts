import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { SubmissionResponseDto } from './dto/submission-response.dto';

@Controller('submissions')
export class SubmissionController {
    constructor(private readonly submissionService: SubmissionService) { }

    @Post()
    async create(@Body() createSubmissionDto: CreateSubmissionDto): Promise<SubmissionResponseDto> {
        return this.submissionService.create(createSubmissionDto);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.submissionService.getSubmission(id);
    }

    @Get()
    async findAll() {
        return this.submissionService.getAll();
    }
}
